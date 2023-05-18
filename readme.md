# MTI/STIN - PainBank
Banka, která vás přesvědčí, že i bolest můžete mít rádi!


## Výsledky z CI pipeliny - Code coverage
Minimální požadavek je 70 %.

[![codecov](https://codecov.io/gh/pavelvachaaa/STIN-PainBank/branch/dev/graph/badge.svg?token=CV8EQL9TJQ)](https://codecov.io/gh/pavelvachaaa/STIN-PainBank)

## Future me
### Deployment
Na serveru je nainstalované privátní uložiště Docker imagů (docker registry). Jak deploynout privátní registry?
Po vygenerování certifikátu je třeba udělat z `.pem` souborů `.key` a `.crt` pro docker container:
```bash
cd /etc/letsencrypt/live/dockerreg.pavel-vacha.cz && \
cp privkey.pem domain.key && \
cat cert.pem chain.pem > domain.crt && \
chmod 777 domain.*
```

Následně se vygeneruje Apache htpasswd pro zabezpečení docker registry heslem:
```bash
mkdir auth

docker run \
  --entrypoint htpasswd \
  httpd:2 -Bbn HESLO UZIVATEL > auth/htpasswd
```

A následné spuštění containeru:
```
docker run -d  --restart=always --name registry \
   -v "$(pwd)"/auth:/auth \
  -e "REGISTRY_AUTH=htpasswd" \
  -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
  -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \
  -v /etc/letsencrypt/live/dockerreg.pavel-vacha.cz:/certs \
  -e REGISTRY_HTTP_ADDR=0.0.0.0:443 \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt \
  -e REGISTRY_HTTP_TLS_KEY=/certs/domain.key \
  -p 5000:443 \
  registry:2
```

Pro přesměrování komunikace `dockerreg.pavel-vacha.cz` na port 5000 je prováděno pomocí nginx reverzní proxy. (Úprava v _/etc/nginx/conf.d/vas_soubor.conf_)
```
server {
    listen 5000;
    server_name dockerreg.pavel-vacha.cz;
    return 301 https://$server_name$request_uri;
}

server {
        listen 443 ssl;
        listen [::]:443 ssl;
        server_name dockerreg.pavel-vacha.cz;

       #Size archive        client_max_body_size 50M;

        ssl_certificate          /etc/letsencrypt/live/dockerreg.pavel-vacha.cz/fullchain.pem;
        ssl_certificate_key      /etc/letsencrypt/live/dockerreg.pavel-vacha.cz/privkey.pem;
        ssl_trusted_certificate  /etc/letsencrypt/live/dockerreg.pavel-vacha.cz/chain.pem;

       location / {
               proxy_set_header   X-Forwarded-For $remote_addr;
               proxy_set_header   Host $http_host;
               proxy_pass           s;
       }
}
```

po té již lze provést `docker login dockerreg.pavel-vacha.cz` a push/pullovat image z registry.