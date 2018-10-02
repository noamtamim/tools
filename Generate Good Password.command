#!/usr/bin/env python

from os import urandom, system

CHARS='abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'

rnd = urandom(16)

pwd = ''.join([CHARS[ord(b) % len(CHARS)] for b in rnd])

system('printf ' + pwd + ' | pbcopy')
