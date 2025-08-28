from fastapi import FastAPI
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI()

# --- Database setup ---
MONGO_URI = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URI)
db = client["mydatabase"]
contacts = db["contacts"]

# --- Pydantic model ---
class Contact(BaseModel):
    name: str
    email: str
    message: str

# --- Routes ---
@app.post("/contact")
async def create_contact(contact: Contact):
    result = await contacts.insert_one(contact.dict())
    return {"id": str(result.inserted_id), "message": "Contact saved!"}

@app.get("/contacts")
async def list_contacts():
    docs = []
    async for doc in contacts.find():
        doc["_id"] = str(doc["_id"])  # convert ObjectId to string
        docs.append(doc)
    return docs


@app.get("/contact/{contact_id}")
async def get_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact