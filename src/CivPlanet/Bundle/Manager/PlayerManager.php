<?php

namespace CivPlanet\Bundle\Manager;

use Doctrine\ORM\EntityManager;

class PlayerManager
{
    private $entityManager;
    private $playerRepository;
    private $sessionRepository;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->playerRepository = $entityManager->getRepository('CPBundle:Player');
        $this->sessionRepository = $entityManager->getRepository('CPBundle:Session');
    }

    public function getPlayer($username)
    {
        return $this->playerRepository->findOneByUsername($username);
    }

    public function getPlayers()
    {
        return $this->playerRepository->findAllOrderedByTimestamp();
    }

    public function getOnlinePlayers()
    {
        return $this->sessionRepository->findOnlineOrderedByTimestamp();
    }
}