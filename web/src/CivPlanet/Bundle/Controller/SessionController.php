<?php

namespace CivPlanet\Bundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class SessionController extends Controller
{
    public function listForChartAction($username)
    {
        $playerManager = $this->get('civplanet.player_manager');
        $player = $playerManager->getPlayer($username);

        $duration = 0;
        foreach ($player->getSessions() as $session) {
            $duration += $session->getDuration();
        }
    }
}