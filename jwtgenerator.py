import os
import binascii

JWT_SECRET = binascii.hexlify(os.urandom(24)).decode()
print("Your JWT Secret Key:", JWT_SECRET)
