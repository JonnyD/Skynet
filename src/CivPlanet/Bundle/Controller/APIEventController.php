<?php

namespace CivPlanet\Bundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\Controller\Annotations\QueryParam;

class APIEventController extends Controller
{

    /**
     * @QueryParam(name="username", nullable=true)
     */
    public function getEventsAction(ParamFetcher $paramFetcher)
    {
        foreach ($paramFetcher->all() as $criterionName => $criterionValue) {
            $username = $criterionValue;
        }

        print_r($username);

        $eventManager = $this->get('civplanet.event_manager');
        $events = array();
        if ($username != null && !empty($username) && $username != "") {
            print_r("hello");
            $events = $eventManager->getEventsByUsername($username);
        } else {
            $events = $eventManager->getEvents();
        }

        return array("events" => $events);
    }
}