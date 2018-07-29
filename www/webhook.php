<?php

$hookSecret = trim(file_get_contents("/var/www/html/.webhook_secret"));

if($hookSecret !== NULL)
{
  if(!isset($_SERVER["HTTP_X_HUB_SIGNATURE"]))
  {
    exit("HTTP header 'X-Hub-Signature' is missing.");
  }
  else if(!extension_loaded("hash"))
  {
    exit("Missing 'hash' extension to check the secret code validity.");
  }
  list($algo, $hash) = explode("=", $_SERVER["HTTP_X_HUB_SIGNATURE"], 2) + array("", "");

  if(!in_array($algo, hash_algos(), TRUE))
  {
    exit("Hash algorithm '$algo' is not supported.");
  }
  $rawPost = file_get_contents("php://input");

  if($hash !== hash_hmac($algo, $rawPost, $hookSecret))
  {
      exit("Hook secret does not match.....");
  }
};

switch(strtolower($_SERVER["HTTP_X_GITHUB_EVENT"]))
{
  case "ping":
    echo "pong.....";
    break;
  case "push":
    // Get the current user. Pull the repo, kill node and start it again
    $user = $_SERVER["USER"];
    if($user == "wavesserver"){
      system("cd /var/www/html/waves/WavesClient && /usr/bin/git checkout dev && /usr/bin/git reset HEAD --hard && /usr/bin/git pull origin master", $dummy);
      system("cd /var/www/html/waves/WavesServer && /usr/bin/git checkout dev && /usr/bin/git reset HEAD --hard && /usr/bin/git pull origin master", $dummy2);
      system("killall node", $dummy3);
      system("/usr/bin/node /var/www/html/waves/WavesServer/server.js 8885 &", $dummy4);
      echo "Ran Waves commands " . $dummy . "\n" . $dummy2 . "\n" . $dummy3 . "\n" . $dummy4;
    }
    break;
  default:
    header("HTTP/1.0 404 Not Found");
    echo "Event:$_SERVER[HTTP_X_GITHUB_EVENT] Payload:\n";
    print_r($payload); # For debug only. Can be found in GitHub hook log.
    exit;
    break;
}
