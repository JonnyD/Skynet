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
     * @QueryParam(name="from", nullable=true)
     * @QueryParam(name="to", nullable=true)
     * @QueryParam(name="type", nullable=true)
     */
    public function getEventsAction(ParamFetcher $paramFetcher)
    {
        $params = array();
        foreach ($paramFetcher->all() as $criterionName => $criterionValue) {
            if (isset($criterionValue) && $criterionValue != null) {
                if ($criterionName === 'username') {
                    $params['username'] = $criterionValue;
                } else if ($criterionName === 'type') {
                    $params['type'] = $criterionValue;
                } else if ($criterionName === 'from') {
                    $params['from'] = $criterionValue;
                } else if ($criterionName === 'to') {
                    $params['to'] = $criterionValue;
                }
            }
        }

        $eventManager = $this->get('civplanet.event_manager');
        $events = $eventManager->getEvents($params);

        return array("events" => $events);
    }
}