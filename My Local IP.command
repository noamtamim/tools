#!/bin/bash
export ADDR=$(ifconfig | perl -ne 'if (m/(\d+\.\d+\.\d+\.\d+)/) {print "$1\n.\n.\n"}')
osascript -e 'display alert (system attribute "ADDR")'
