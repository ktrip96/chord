#!/bin/bash

node insert.js 3002 trip
sleep 2
node insert.js 3002 mitsos
sleep 2
node query.js 3002 trip
sleep 2
node query.js 3002 mitsos
sleep 2
node delete.js 3002 trip
sleep 2
node delete.js 3002 mitsos
sleep 2
