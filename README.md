# StudentCardProducer
application to produce student card in AWS Cloud using S3, Lambda, SNS, SQS

# Detail Design

<img src="https://github.com/KateVu/StudentCardProducer/blob/master/Images/detail_design.png">

# Front-end
- Using html, javascript, css and hosted in S3

<img src="https://github.com/KateVu/StudentCardProducer/blob/master/Images/front_end.png">

# Query all cards images
•	<b>Diagram:</b>

<img src="https://github.com/KateVu/StudentCardProducer/blob/master/Images/get_all_images.png">

•	<b>Interface description:</b>

Create API “CardsQuery” in Amazon API Gateway
-	Title: "CardsQuery"
-	Description: call by static website, invoke lambda to get all images from S3
-	Path of the resource:
		Request description: the name of the bucket contains student images as input
		Request parameters expected (in POST request boy): 
			{bucket_name: name of bucket contains images}
		Response description: return the name of the image and its url
		Response MIME Content type: "application/json": 
		{allCards: [
			{
		   	   id: name of the image, 
			   imageUrl: url of the image
			}
			    ]
		}
Lambda function “cardproducer-retrieve-s3-objects” 
-	Title: "cardproducer-retrieve-s3-objects"
-	Description: call by API CardsQuery, get all images from S3 bucket image
-	AWS API invokes the function via name: cardproducer-retrieve-s3-objects
-	Request description: the name of the bucket contains student images as inpu
-	Request parameters expected: {bucket_name: name of bucket contains images}
-	Response description: return the name of the image and its url
-	Response MIME Content type: "json": 
{allCards: [
		{
		   id: name of the image, 
		   imageUrl: url of the image
		}
		]
}

# Create new Student
•	<b>Diagram</b>:

<img src="https://github.com/KateVu/StudentCardProducer/blob/master/Images/create_new_student.png">

•	<b>Interface description:</b>

API “CreateNewStudent” 
-	Title: " CreateNewStudent"
-	Description: call by static website, invoke lambda to create new student 
-	Path of the resource:
		Request description: information of the new student
		Request parameters expected (in POST request boy): 
			{	student_name: name of the student,
				student_dob: date of birth of the student
			}
		Response description: return student id
		Response content type: "application/json": 	
		{student_id: student_id}
Lambda function “cardproducer-retrieve-s3-objects” 
-	Title: "cardproducer-insert-newstudent-dynamodb"
-	Description: call by API CreateNewStudent, put new item with passed information in dynamodb
-	AWS API invokes the function via name: cardproducer-insert-newstudent-dynamodb
-	Request description: information of the student
-	Request parameters expected: 
{student_name: name of the student,
  student_dob: date of birth of the student
-	Response description: student id
-	Response Content type: "json": {student_id: student_id}

Lambda function “cardproducer-pub-sns-NewStudent” 
-	Title: "cardproducer-pub-sns-NewStudent"
-	Description: trigger by dynamodb whenever an item in the table is created/modified or deleted, pass the information of the item into lambda
-	Dynamodb invokes the function by setting table of dynamodb as trigger of the function cardproducer-pub-sns-NewStudent
-	Request description: the information of the new/edited/deleted items are passed through
-	Request parameters expected: 
 
-	Response description: send student information to SNS Topic “NewStudent”
-	Response Content type (message in params of function publish of sns) "text": 
`{"student_id": ${student_id}, "student_name":${student_name}, "student_dob": ${student_dob}}`


Lambda function “cardproducer-generate-card” 
-	Title: "cardproducer-generate-card"
-	Description: polling SQS message and generate new student card
-	SQS invokes the function via name: cardproducer-generate-card
-	Request description: information of the student  
