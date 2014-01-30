<?php

namespace CivPlanet\Bundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\Controller\Annotations\QueryParam;

class APIPlayerController extends Controller
{

    public function getPlayersAction()
    {
        $playerManager = $this->get('civplanet.player_manager');
        $players = $playerManager->getPlayers();

        return array("players" => $players);
    }

    /**
     * @View(serializerGroups={"online"})
     * @QueryParam(name="at", nullable=true)
     * @QueryParam(name="from", nullable=true)
     * @QueryParam(name="to", nullable=true)
     */
    public function getOnlineAction(ParamFetcher $paramFetcher)
    {
        $params = array();
        foreach ($paramFetcher->all() as $criterionName => $criterionValue) {
            if (isset($criterionValue) && $criterionValue != null) {
                if ($criterionName === 'at') {
                    $params['at'] = $criterionValue;
                } else {
                    if ($criterionName === 'from') {
                        $params['from'] = $criterionValue;
                    } else if ($criterionName === 'to') {
                        $params['to'] = $criterionValue;
                    }
                }
            }
        }

        $playerManager = $this->get('civplanet.player_manager');
        $players = $playerManager->getPlayersOnline($params);

        return array("online" => $players);
    }

    public function getPlayerAction($username)
    {
        $playerManager = $this->get('civplanet.player_manager');
        $player = $playerManager->getPlayer($username);

        return array("player" => $player);
    }
}