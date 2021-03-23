#!/bin/bash

node insert.js 3002 trip
sleep 5
node insert.js 3002 mitsos
sleep 5
node query.js 3002 trip
sleep 5
node query.js 3002 mitsos
sleep 5
node delete.js 3002 trip
sleep 5
node delete.js 3002 mitsos
