import subprocess
from random import randrange

f = open("requests.txt","r")
line  = f.readline()
requests = []
while(line!=""):
    temp = line.split(",")
    if temp[0]=="insert":
        requests.append([temp[1],temp[2].strip()])
    elif temp[0]=="query":
        requests.append([temp[1].strip()])
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
while(len(requests)!=0):
    random  = randrange(length)
    if len(requests[0]) ==1 :
        key = "'" + requests[0][0] + "'"
        string = "node event.js " + ips[random][0] +\
        ":" + ips[random][1] + " query " + key
    elif len(requests[0]) == 2:
        key  =  "'"+ requests[0][0] + "'"
        string = "node event.js " + ips[random][0] +\
        ":" + ips[random][1] + " insert " + key + " " + requests[0][1]
    print(string)
   # subprocess.call([string])
    requests.pop(0)



