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
    node = "node"
    event  = "/home/gnostis/chord/back/commands/event.js"
    arg1 = ips[random][0] + ":" + ips[random][1]
    arg2 = "insert"
    arg3  = insert[0][1]
    string = "node /home/gnostis/chord/back/commands/event.js " + ips[random][0] +\
    ":" + ips[random][1] + " insert " + key + " " + insert[0][1]
    #print(string)
    subprocess.call([node,event,arg1,arg2,key,arg3])
    insert.pop(0)



