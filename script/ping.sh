base=http://127.0.0.1:3000

ping() {
    app=$1
    echo curl $base/api/$app/ping
    curl $base/api/$app/ping
    echo ""
}

ping auth
ping org
ping mdata
