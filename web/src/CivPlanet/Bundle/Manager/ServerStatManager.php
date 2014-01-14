<?php

namespace CivPlanet\Bundle\Manager;

use Doctrine\ORM\EntityManager;

class ServerStatManager
{
    private $entityManager;
    private $serverStatRepository;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->serverStatRepository = $entityManager->getRepository('CPBundle:ServerStat');
    }

    public function getServerStats()
    {
        return $this->serverStatRepository->findAll();
    }
}