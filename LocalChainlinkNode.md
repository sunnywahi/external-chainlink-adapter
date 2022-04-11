# Starting your own Chainlink node

We list steps here deploying chainlink node over GCP using VM, we have followed steps marked in
`https://docs.chain.link/docs/running-a-chainlink-node/`

## GCP VM and PostgreSQL instance
- `cloud login` - make your GCP account and then make sure you have named your Project to what you may like
- `VM instances`- Go over Compute Engine option on left-hand side and choose VM Instance and thn create instance, name it chainlink-kovan
- Follow the following link for making your VM instance
```
   https://www.youtube.com/watch?v=t9Uknfw27IU
```

## Install the docker image on VM
- Once you have setup the ssh over your vm instance (note you will need google sdk for connecting from local machine), after watching the above video, you can do the following command
```
    gcloud compute --project "REPLACE WITH YOUR PROJECT ID" ssh --zone "REPLACE ZONE" "chainlink-kovan" -- -L 6688:localhost:6688
```
- REPLACE WITH YOUR PROJECT ID- the project id that you have setup the VM in.
- REPLACE ZONE- zone of the project ID
- Then do the following step for Ubuntu, you can find the step here `https://docs.chain.link/docs/running-a-chainlink-node/`
```
curl -sSL https://get.docker.com/ | sh
sudo usermod -aG docker $USER
exit
# log in again

```

## If you running thirdparty eth client then setup the client for your blockchain network in our case it is KOVAN
- `setup infura acccount`- setup project for kovan

## Setup steps on VM instance after initial docker is installed
- `mkdir ~/.chainlink-kovan`
- `create .env file with following properties`
```
     echo "ROOT=/chainlink 
     LOG_LEVEL=debug
     ETH_CHAIN_ID=42
     CHAINLINK_TLS_PORT=0
     SECURE_COOKIES=false
     ALLOW_ORIGINS=*" > ~/.chainlink-kovan/.env
  ```
- Since we are using third party eth client we update .env file 
```
    echo "ETH_URL=CHANGEME" >> ~/.chainlink-kovan/.env
```
#### where CHANGEME is update the value for CHANGEME to the value given by your provider or the address and port of your separate instance, in our case it is ETH_URL=wss://kovan.infura.io/ws/v3/7047f9ad6bd44e84836a99fe1c1845d9

- Set the Database URL in your .env file
```
   echo "DATABASE_URL=postgresql://$USERNAME:$PASSWORD@$SERVER:$PORT/$DATABASE" >> ~/.chainlink-kovan/.env
```
- Install the node image from docker
```
    docker pull smartcontract/chainlink:1.2.0
```
- Start the node
```
    cd ~/.chainlink-kovan && docker run --rm --name kovan-main -p 6688:6688 -v ~/.chainlink-kovan:/chainlink -it --env-file=.env smartcontract/chainlink:1.2.0 local n
```
-  here we have named your docker image as kovan-main, if you want to change it, then edit `--name XXXX`
Please note: The first time running the image, it will ask you for a password and confirmation. This will be your wallet password that you can use to unlock the keystore file generated for you. Then, you'll be prompted to enter an API Email and Password, this will be your login password to UI.


