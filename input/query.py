import subprocess
from random import randrange

f = open("query.txt","r")
line  = f.readline()
query = []
while(line!=""):
    temp  = line
    query.append(temp.strip())
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
while(len(query)!=0):
    random  = randrange(length)
    key  =  "'"+ query[0] + "'"
    node  = "node"
    event = "/home/gnostis/chord/back/commands/event.js"
    arg1 = ips[random][0] + ":" + ips[random][1]
    arg2 = "query"
    string = "node event.js " + ips[random][0] +\
    ":" + ips[random][1] + " query " + key
   # print(string)
    subprocess.call([node,event,arg1,arg2,key])
    query.pop(0)
