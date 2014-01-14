<?php

namespace CivPlanet\Bundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations\View;

class APIEventController extends Controller
{

    public function getEventsAction()
    {
        $eventManager = $this->get('civplanet.event_manager');
        $events = $eventManager->getEvents();

        return array("events" => $events);
    }
}