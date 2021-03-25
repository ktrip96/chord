#!/bin/bash

node insert.js 3002 trip
sleep 3
node insert.js 3002 mitsos
sleep 3
node query.js 3002 trip
sleep 3
node query.js 3002 mitsos
sleep 3
node delete.js 3002 trip
sleep 3
node delete.js 3002 mitsos
