from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Flappy Fish Backend API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============== Models ==============

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Game Data Models
class GameDataCreate(BaseModel):
    """Model for creating/updating game data"""
    user_id: str
    high_score: int = 0
    coins: int = 0
    unlocked_skins: List[str] = ["default"]
    selected_skin: str = "default"
    owned_power_ups: Dict[str, int] = {}
    ads_removed: bool = False
    total_games_played: int = 0
    total_coins_earned: int = 0
    unlocked_achievements: List[str] = []
    achievement_stats: Dict[str, int] = {}

class GameDataResponse(BaseModel):
    """Model for game data response"""
    model_config = ConfigDict(extra="ignore")
    user_id: str
    high_score: int = 0
    coins: int = 0
    unlocked_skins: List[str] = ["default"]
    selected_skin: str = "default"
    owned_power_ups: Dict[str, int] = {}
    ads_removed: bool = False
    total_games_played: int = 0
    total_coins_earned: int = 0
    unlocked_achievements: List[str] = []
    achievement_stats: Dict[str, int] = {}
    created_at: str
    updated_at: str

class LeaderboardEntry(BaseModel):
    """Model for leaderboard entry"""
    model_config = ConfigDict(extra="ignore")
    user_id: str
    username: Optional[str] = None
    high_score: int
    rank: Optional[int] = None

class PurchaseRecord(BaseModel):
    """Model for purchase record"""
    user_id: str
    product_id: str
    transaction_id: str
    platform: str  # 'ios' or 'android'
    amount: Optional[float] = None
    currency: Optional[str] = None

class PurchaseRecordResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    product_id: str
    transaction_id: str
    platform: str
    amount: Optional[float] = None
    currency: Optional[str] = None
    created_at: str

# ============== Health Check Routes ==============

@api_router.get("/")
async def root():
    return {"message": "Flappy Fish API", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# ============== Game Data Routes ==============

@api_router.post("/game/sync", response_model=GameDataResponse)
async def sync_game_data(data: GameDataCreate):
    """
    Sync game data from mobile app to cloud.
    Creates new user if not exists, updates if exists.
    """
    now = datetime.now(timezone.utc).isoformat()
    
    # Check if user exists
    existing = await db.game_data.find_one({"user_id": data.user_id}, {"_id": 0})
    
    if existing:
        # Update existing - merge data intelligently
        update_data = {
            "high_score": max(data.high_score, existing.get("high_score", 0)),
            "coins": data.coins,
            "unlocked_skins": list(set(existing.get("unlocked_skins", []) + data.unlocked_skins)),
            "selected_skin": data.selected_skin,
            "owned_power_ups": data.owned_power_ups,
            "ads_removed": data.ads_removed or existing.get("ads_removed", False),
            "total_games_played": max(data.total_games_played, existing.get("total_games_played", 0)),
            "total_coins_earned": max(data.total_coins_earned, existing.get("total_coins_earned", 0)),
            "unlocked_achievements": list(set(existing.get("unlocked_achievements", []) + data.unlocked_achievements)),
            "achievement_stats": {**existing.get("achievement_stats", {}), **data.achievement_stats},
            "updated_at": now,
        }
        
        await db.game_data.update_one(
            {"user_id": data.user_id},
            {"$set": update_data}
        )
        
        # Fetch updated document
        updated = await db.game_data.find_one({"user_id": data.user_id}, {"_id": 0})
        return GameDataResponse(**updated)
    else:
        # Create new user
        new_doc = data.model_dump()
        new_doc["created_at"] = now
        new_doc["updated_at"] = now
        
        await db.game_data.insert_one(new_doc)
        return GameDataResponse(**new_doc)

@api_router.get("/game/{user_id}", response_model=GameDataResponse)
async def get_game_data(user_id: str):
    """Get game data for a specific user"""
    data = await db.game_data.find_one({"user_id": user_id}, {"_id": 0})
    
    if not data:
        raise HTTPException(status_code=404, detail="User not found")
    
    return GameDataResponse(**data)

@api_router.post("/game/{user_id}/coins/add")
async def add_coins(user_id: str, amount: int):
    """Add coins to user's balance (after purchase)"""
    result = await db.game_data.update_one(
        {"user_id": user_id},
        {
            "$inc": {"coins": amount, "total_coins_earned": amount},
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get updated balance
    data = await db.game_data.find_one({"user_id": user_id}, {"_id": 0, "coins": 1})
    return {"success": True, "coins": data["coins"], "added": amount}

@api_router.post("/game/{user_id}/highscore")
async def update_high_score(user_id: str, score: int):
    """Update high score if new score is higher"""
    existing = await db.game_data.find_one({"user_id": user_id}, {"_id": 0, "high_score": 1})
    
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")
    
    current_high = existing.get("high_score", 0)
    
    if score > current_high:
        await db.game_data.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "high_score": score,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        return {"success": True, "new_high_score": score, "previous": current_high}
    
    return {"success": True, "new_high_score": current_high, "submitted": score, "is_new_record": False}

# ============== Leaderboard Routes ==============

@api_router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(limit: int = 100):
    """Get top players by high score"""
    pipeline = [
        {"$sort": {"high_score": -1}},
        {"$limit": limit},
        {"$project": {"_id": 0, "user_id": 1, "username": 1, "high_score": 1}}
    ]
    
    entries = await db.game_data.aggregate(pipeline).to_list(limit)
    
    # Add rank
    for i, entry in enumerate(entries):
        entry["rank"] = i + 1
    
    return [LeaderboardEntry(**e) for e in entries]

@api_router.get("/leaderboard/{user_id}/rank")
async def get_user_rank(user_id: str):
    """Get a specific user's rank on the leaderboard"""
    user = await db.game_data.find_one({"user_id": user_id}, {"_id": 0, "high_score": 1})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_score = user.get("high_score", 0)
    
    # Count how many users have higher scores
    higher_count = await db.game_data.count_documents({"high_score": {"$gt": user_score}})
    rank = higher_count + 1
    
    return {"user_id": user_id, "high_score": user_score, "rank": rank}

# ============== Purchase Routes ==============

@api_router.post("/purchases/record", response_model=PurchaseRecordResponse)
async def record_purchase(purchase: PurchaseRecord):
    """Record a purchase transaction"""
    now = datetime.now(timezone.utc).isoformat()
    
    doc = purchase.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = now
    
    await db.purchases.insert_one(doc)
    
    return PurchaseRecordResponse(**doc)

@api_router.get("/purchases/{user_id}", response_model=List[PurchaseRecordResponse])
async def get_user_purchases(user_id: str):
    """Get all purchases for a user"""
    purchases = await db.purchases.find(
        {"user_id": user_id}, 
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return [PurchaseRecordResponse(**p) for p in purchases]

# ============== RevenueCat Webhook ==============

@api_router.post("/webhook/revenuecat")
async def revenuecat_webhook(payload: dict):
    """
    Handle RevenueCat webhook events.
    Configure webhook URL in RevenueCat dashboard as:
    https://your-domain.com/api/webhook/revenuecat
    """
    try:
        event = payload.get("event", {})
        event_type = event.get("type")
        app_user_id = payload.get("app_user_id")
        
        logger.info(f"[RevenueCat Webhook] Event: {event_type}, User: {app_user_id}")
        
        if event_type in ["INITIAL_PURCHASE", "RENEWAL", "PRODUCT_CHANGE"]:
            product_id = event.get("product_id")
            
            # Record the purchase
            await db.purchases.insert_one({
                "id": str(uuid.uuid4()),
                "user_id": app_user_id,
                "product_id": product_id,
                "transaction_id": event.get("transaction_id", ""),
                "platform": event.get("store", "unknown"),
                "event_type": event_type,
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
            
            # Grant coins or entitlements based on product
            if "coins" in product_id:
                coin_amounts = {
                    "coins_100": 100,
                    "coins_500": 550,  # 500 + 50 bonus
                    "coins_1000": 1200,  # 1000 + 200 bonus
                }
                coins_to_add = coin_amounts.get(product_id, 0)
                if coins_to_add > 0:
                    await db.game_data.update_one(
                        {"user_id": app_user_id},
                        {"$inc": {"coins": coins_to_add, "total_coins_earned": coins_to_add}}
                    )
            
            elif product_id == "remove_ads":
                await db.game_data.update_one(
                    {"user_id": app_user_id},
                    {"$set": {"ads_removed": True}}
                )
        
        elif event_type == "CANCELLATION":
            # Handle subscription cancellation if needed
            pass
        
        elif event_type == "REFUND":
            # Handle refund - could revoke entitlements
            product_id = event.get("product_id")
            if product_id == "remove_ads":
                await db.game_data.update_one(
                    {"user_id": app_user_id},
                    {"$set": {"ads_removed": False}}
                )
        
        return {"status": "ok"}
    
    except Exception as e:
        logger.error(f"[RevenueCat Webhook] Error: {e}")
        return {"status": "error", "message": str(e)}

# Include the router in the main app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db_client():
    # Create indexes for better query performance
    await db.game_data.create_index("user_id", unique=True)
    await db.game_data.create_index("high_score")
    await db.purchases.create_index("user_id")
    await db.purchases.create_index("transaction_id")
    logger.info("Database indexes created")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
