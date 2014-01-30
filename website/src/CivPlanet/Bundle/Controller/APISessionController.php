<?php

namespace CivPlanet\Bundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\Controller\Annotations\QueryParam;

class APISessionController extends Controller
{

    public function getSessionAction($id)
    {
        $sessionManager = $this->get('civplanet.session_manager');
        $session = $sessionManager->getSession($id);

        return array('session' => $session);
    }

    /**
     * @QueryParam(name="username", nullable=true)
     */
    public function getSessionsAction(ParamFetcher $paramFetcher)
    {
        $params = array();
        foreach ($paramFetcher->all() as $criterionName => $criterionValue) {
            if (isset($criterionValue) && $criterionValue != null) {
                if ($criterionName === 'username') {
                    $params['username'] = $criterionValue;
                }
            }
        }

        $sessionManager = $this->get('civplanet.session_manager');
        $sessions = $sessionManager->getSessions($params);

        return array('sessions' => $sessions);
    }
}