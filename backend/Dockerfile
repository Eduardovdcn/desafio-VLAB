FROM php:8.3-cli-alpine

RUN docker-php-ext-install pdo_pgsql

WORKDIR /var/www/html

COPY public ./public

EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]