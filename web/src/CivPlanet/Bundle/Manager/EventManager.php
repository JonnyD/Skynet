<?php

namespace CivPlanet\Bundle\Manager;

use Doctrine\ORM\EntityManager;

class EventManager
{
    private $entityManager;
    private $eventRepository;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->eventRepository = $entityManager->getRepository('CPBundle:Event');
    }

    public function getEvents()
    {
        return $this->eventRepository->findAllOrderedByTimestamp();
    }
}