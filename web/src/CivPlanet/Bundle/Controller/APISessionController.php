<?php

namespace CivPlanet\Bundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations\View;

class APISessionController extends Controller
{

    public function getSessionsAction()
    {
        $sessionManager = $this->get('civplanet.session_manager');
        $sessions = $sessionManager->getSessions();

        return array('sessions' => $sessions);
    }
}