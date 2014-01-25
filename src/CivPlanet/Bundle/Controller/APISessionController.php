<?php

namespace CivPlanet\Bundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations\View;

class APISessionController extends Controller
{

    public function getSessionAction($id)
    {
        $sessionManager = $this->get('civplanet.session_manager');
        $session = $sessionManager->getSession($id);

        return array('session' => $session);
    }

    public function getSessionsAction()
    {
        $sessionManager = $this->get('civplanet.session_manager');
        $sessions = $sessionManager->getSessions();

        return array('sessions' => $sessions);
    }
}