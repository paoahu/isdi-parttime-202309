source pepetest.sh

TEST authenticate-user


CASE success on correct credentials

curl 'http://localhost:9000/users/auth' \
-H 'Content-Type: application/json' \
-d '{"email": "le@chuga.com", "password": "123123123" }' \
-v


CASE  error on wrong email

curl 'http://localhost:9000/users/auth' \
-H 'Content-Type: application/json' \
-d '{"email": "coli@flor.com", "password": "123123123" }' \
-v

CASE  error on wrong pasword

curl 'http://localhost:9000/users/auth' \
-H 'Content-Type: application/json' \
-d '{"email": "azucar@moreno.com", "password": "133" }' \
-v


# > POST /users/auth HTTP/1.1
# > Host: localhost:8000
# > User-Agent: curl/8.1.2
# > Accept: */*
# > Content-Type: application/json
# > Content-Length: 72

#  HTTP/1.1 200 OK
# < X-Powered-By: Express
# < Content-Type: application/json; charset=utf-8
# < Content-Length: 14
# < ETag: W/"e-1PnaV+R0j+BTdAut43t7g2OdIoY"
# < Date: Sat, 16 Dec 2023 15:58:59 GMT
# < Connection: keep-alive
# < Keep-Alive: timeout=5
# "2t26hnde0xc0"