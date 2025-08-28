from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel

# Database setup
DATABASE_URL = "sqlite:///./contact.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, index=True)
    subject = Column(String, index=True)
    message = Column(String, index=True)

Base.metadata.create_all(bind=engine)

# Pydantic model
class ContactCreate(BaseModel):
    name: str
    email: str
    subject: str
    message: str

# FastAPI app
app = FastAPI()

# Allow CORS (important for frontend to connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/contact")
def create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    db_contact = Contact(
        name=contact.name,
        email=contact.email,
        subject=contact.subject,
        message=contact.message,
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return {"message": "Contact form submitted successfully!", "id": db_contact.id}

@app.get("/contacts")
def get_contacts(db: Session = Depends(get_db)):
    return db.query(Contact).all()