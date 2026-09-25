#!/usr/bin/env bash
set -e

if [ ! -f .env ]; then
    cp .env.example .env
fi

php artisan key:generate --force >/dev/null 2>&1 || true
php artisan migrate --force
php artisan db:seed --force
exec php artisan serve --host=0.0.0.0 --port=8000
