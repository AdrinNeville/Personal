from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000"],  # or restrict to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database setup ---
MONGO_URI = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URI)
db = client["mydatabase"]
contacts = db["contacts"]

# --- Pydantic model ---
class Contact(BaseModel):
    name: str
    email: str
    subject: str
    message: str

# --- Routes ---
@app.post("/contact")
async def create_contact(contact: Contact):
    try:
        result = await contacts.insert_one(contact.dict())
        return {"id": str(result.inserted_id), "message": "Contact saved!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/contacts")
async def list_contacts():
    docs = []
    async for doc in contacts.find():
        doc["_id"] = str(doc["_id"])  # convert ObjectId to string
        docs.append(doc)
    return docs

@app.get("/contact/{contact_id}")
async def get_contact(contact_id: str):
    try:
        oid = ObjectId(contact_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId")

    doc = await contacts.find_one({"_id": oid})
    if doc:
        doc["_id"] = str(doc["_id"])
        return doc
    raise HTTPException(status_code=404, detail="Contact not found")