# https://hub.docker.com/r/hashicorp/terraform/ 
# FROM hashicorp/terraform:latest
FROM hashicorp/terraform:1.8.4

RUN apk add --update py-pip
RUN pip3 install terraform-local
