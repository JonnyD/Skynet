<?php

namespace CivPlanet\Bundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class PlayerController extends Controller
{

    /**
     * @Route("/players/{username}", name="show_player")
     */
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

    /**
     * @Route("/players")
     */
    public function listAllAction()
    {
        $playerManager = $this->get('civplanet.player_manager');
        $players = $playerManager->getPlayers();

        return $this->render(
            'CPBundle:Player:listAll.html.twig',
            array('players' => $players)
        );
    }
}