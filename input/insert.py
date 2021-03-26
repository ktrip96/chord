import subprocess
from random import randrange

f = open("insert.txt","r")
line  = f.readline()
insert = []
while(line!=""):
    temp = line.split(",")
    insert.append([temp[0],temp[1].strip()])
    line = f.readline()
f1 = open("ips.txt","r")
line  = f1.readline()
ips=[]
while(line!=""):
    temp = line.split(":")
    ips.append([temp[0],temp[1].strip()])
    line = f1.readline()
    
index1,index= 0,0
i=0

length = len(ips)
while(len(insert)!=0):
    random  = randrange(length)
    key  =  "'"+ insert[0][0] + "'"
    string = "node event.js " + ips[random][0] +\
    ":" + ips[random][1] + " insert " + key + " " + insert[0][1]
    print(string)
   # subprocess.call([string])
    insert.pop(0)



