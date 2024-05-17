from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from typing import List

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['customer_manager']
collection = db['customers']

class Customer(BaseModel):
    name: str
    email: str
    fav_number: int

def is_duplicate(email: str) -> bool:
    return collection.find_one({'email': email}) is not None

@app.get("/customers", response_model=List[Customer])
def get_customers():
    customers = list(collection.find({}, {'_id': 0}))  # Exclude the '_id' field
    return customers

@app.post("/customers", response_model=Customer, status_code=status.HTTP_201_CREATED)
def add_customer(customer: Customer):
    if is_duplicate(customer.email):
        raise HTTPException(status_code=400, detail="Customer with email already exists")
    collection.insert_one(customer.dict())
    return customer

@app.put("/customers/{email}", response_model=Customer)
def update_customer(email: str, new_data: Customer):
    customer = collection.find_one({'email': email})
    if customer:
        update_query = {'$set': new_data.dict()}
        collection.update_one({'email': email}, update_query)
        return {**customer, **new_data.dict()}
    else:
        raise HTTPException(status_code=404, detail="Customer not found")

@app.delete("/customers/{email}")
def delete_customer(email: str):
    result = collection.delete_one({'email': email})
    if result.deleted_count == 1:
        return {"message": "Customer deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Customer not found")

@app.get("/customers/search/{query}", response_model=List[Customer])
def search_customer(query: str):
    search_query = {'$or': [{'name': {'$regex': query, '$options': 'i'}}, {'email': {'$regex': query, '$options': 'i'}}]}
    results = list(collection.find(search_query, {'_id': 0}))
    return results

@app.get("/customers/sort/{by}", response_model=List[Customer])
def sort_customers(by: str):
    if by in ['name', 'email', 'fav_number']:
        sorted_customers = list(collection.find().sort(by))
        for customer in sorted_customers:
            customer.pop('_id', None)
        return sorted_customers
    else:
        raise HTTPException(status_code=400, detail="Invalid sort key")
