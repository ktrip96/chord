import subprocess
from random import randrange

f = open("insert.txt","r")
line  = f.readline()
lst = []
while(line!=""):
    temp = line.split(",")
    lst.append([temp[0],temp[1].strip()])
    line = f.readline()
f1 = open("ips.txt","r")
line  = f1.readline()
lst1=[]
while(line!=""):
    temp = line.split(":")
    lst1.append([temp[0],temp[1].strip()])
    line = f1.readline()
    
index1,index= 0,0
i=0

length = len(lst1)
while(len(lst)!=0):
    random  = randrange(length)
    string = "node event.js " + lst1[random][0] +\
    ":" + lst1[random][1] + " insert " + lst[0][0] + " " + lst[0][1]
    subprocess.call([string])
    lst.pop(0)



