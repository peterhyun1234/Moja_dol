import sys
                                  
uID = sys.argv[1]

print("uID: " + uID)

f = open("testtest.txt", 'w')
for i in range(1, 500):
    f.write("잘동작하냐" + str(i))

print("all clear!")

f.close()