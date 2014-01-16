<?php

namespace CivPlanet\Bundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations\View;

class APIPlayerController extends Controller
{

    public function showAction($username)
    {
        $playerManager = $this->get('civplanet.player_manager');
        $player = $playerManager->getPlayer($username);

        $sessionManager = $this->get('civplanet.session_manager');
        $test = $sessionManager->getSessions();
        print_r($test);

        return $this->render('CPBundle:Player:showPlayer.html.twig', array(
                'player' => $player,
                'sessions' => $test
            )
        );
    }

    public function getPlayersAction()
    {
        $playerManager = $this->get('civplanet.player_manager');
        $players = $playerManager->getPlayers();

        return array("players" => $players);
    }

    /**
     * @View(serializerGroups={"online"})
     */
    public function getOnlineAction()
    {
        $playerManager = $this->get('civplanet.player_manager');
        $players = $playerManager->getOnlinePlayers();

        return array("online" => $players);
    }
}