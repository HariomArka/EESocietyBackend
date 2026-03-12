#!/bin/bash

# Simple script to test the EEDept backend endpoints
# Make sure the server is running on port 5000 and MongoDB is running

BASE_URL="http://localhost:5000/api"

echo "====================================="
echo "Testing EEDept Backend Endpoints"
echo "====================================="

echo -e "\n1. Testing Server Health"
curl -s http://localhost:5000/

echo -e "\n\n2. Creating a new unapproved Blog (Public)"
BLOG_RES=$(curl -s -X POST $BASE_URL/blogs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First Internship Experience",
    "author": "John Doe",
    "type": "internship",
    "content": "This is a great internship at a top tech company.",
    "imageURL": "https://example.com/image1.jpg"
  }')
echo $BLOG_RES

BLOG_ID=$(echo $BLOG_RES | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

echo -e "\n\n3. Fetching Approved Blogs (Public) - Shouldn't see the new blog yet"
curl -s $BASE_URL/blogs

echo -e "\n\n4. Admin Login"
LOGIN_RES=$(curl -s -X POST $BASE_URL/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Admin",
    "password": "Admin@123"
  }')
echo $LOGIN_RES
TOKEN=$(echo $LOGIN_RES | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo -e "\n\n5. Fetching All Blogs (Admin Only) - Should see the new blog (isapproved: false)"
curl -s -H "Authorization: Bearer $TOKEN" $BASE_URL/admin/blogs

if [ ! -z "$BLOG_ID" ]; then
  echo -e "\n\n6. Approving the Blog (Admin Only)"
  curl -s -X PUT -H "Authorization: Bearer $TOKEN" $BASE_URL/admin/blogs/$BLOG_ID/approve
  
  echo -e "\n\n7. Fetching Approved Blogs Again (Public) - Should see the new blog NOW"
  curl -s $BASE_URL/blogs
fi

echo -e "\n\n8. Creating a Research Project (Public)"
curl -s -X POST $BASE_URL/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Machine Learning for Power Systems",
    "professor": "Dr. Smith",
    "description": "Research on applying ML to predict power grid failures.",
    "expectation": "Knowledge of Python and basic ML algorithms.",
    "duration": "2 semesters",
    "numberOfStudents": 4
  }'

echo -e "\n\n9. Fetching All Research Projects (Public)"
curl -s $BASE_URL/projects

echo -e "\n\n====================================="
echo "Testing Completed"
echo "====================================="
