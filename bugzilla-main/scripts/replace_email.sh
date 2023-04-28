#!/bin/bash
cd $BUGZILLA_WWW

sed -i -e "s|__admin_email__|$BUGZILLA_ADMIN_EMAIL|g" checksetup_answers.txt

value=`cat checksetup_answers.txt`

echo $value