# CAB432-Cloud-Project
A scaling webserver which displays a live stream of tweets, filtered by certain query parameters

## auth.json Format

    {
        "twitter": {
            "consumer_key": "INSERT_HERE",
            "consumer_secret": "INSERT_HERE",
            "access_token_key": "INSERT_HERE",
            "access_token_secret": "INSERT_HERE"
        },
        "aws": {
            "account_id": "INSERT_HERE",
            "access_key_id": "INSERT_HERE",
            "secret_access_key": "INSERT_HERE",
            "region": "us-west-2",
            "api_versions": {
                "ec2": "2016-09-15",
                "sqs": "2012-11-05",
                "elb": "2012-06-01"
            }
        }
    }

# Credits
https://aws.amazon.com/sdk-for-node-js/  
https://www.npmjs.com/package/twitter

http://getbootstrap.com/  
http://fontawesome.io/