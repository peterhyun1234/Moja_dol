from slacker import Slacker


token = 'xoxp-755497320470-755149020551-861262615350-955245705b763bd4857324f7d9a58f6e'
#slack = Slacker(token)

def slack_chat(string):

    slack = Slacker(token)

    slack.chat.post_message('#crawl_info',string)
    return 


 
