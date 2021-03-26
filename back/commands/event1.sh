#!/bin/bash

ip_port='192.168.1.71:5002'
node insert.js $ip_port trip
sleep 3
node query.js $ip_port trip
sleep 3
node delete.js $ip_port trip
