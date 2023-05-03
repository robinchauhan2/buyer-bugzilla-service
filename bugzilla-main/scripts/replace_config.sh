#!/bin/bash
cd $BUGZILLA_WWW

sed -i -e "s|__base_url__|$BUGZILLA_EXTERNAL_URI|g" checksetup_answers.txt

sed -i -e "s|__admin_email__|$BUGZILLA_ADMIN_EMAIL|g" checksetup_answers.txt

