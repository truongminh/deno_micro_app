base=http://127.0.0.1:3000


list() {
    app=$1
    echo curl $base/api/$app/
    curl $base/api/$app/
    echo ""
}

add() {
    app=$1
    body=$2
    echo POST curl $base/api/$app/
    curl -X POST $base/api/$app/ -d "$body"
    echo 
}

get() {
    app=$1
    id=$2
    echo curl $base/api/$app/$id
    curl $base/api/$app/$id
    echo ""
}

patch() {
    app=$1
    id=$2
    body=$3
    echo PATCH curl $base/api/$app/$id
    curl -X PATCH $base/api/$app/$id -d "$body"
    echo 
}

delete() {
    app=$1
    id=$2
    body=$3
    echo DELETE curl $base/api/$app/$id
    curl -X DELETE $base/api/$app/$id
    echo 
}

list org
# add org '{"name": "other"}'
# get org CNVRU5E6
# patch org CNVRU5E6 '{"name": "patched name"}'
delete org CNVRU5E6
list org
