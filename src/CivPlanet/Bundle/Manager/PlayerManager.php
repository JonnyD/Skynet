<?php

namespace CivPlanet\Bundle\Manager;

use Doctrine\ORM\EntityManager;

class PlayerManager
{
    private $entityManager;
    private $playerRepository;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->playerRepository = $entityManager->getRepository('CPBundle:Player');
    }

    public function getPlayer($username)
    {
        return $this->playerRepository->findOneByUsername($username);
    }

    public function getPlayers()
    {
        return $this->playerRepository->findAllOrderedByTimestamp();
    }

    public function getPlayersOnline($params)
    {
        if ($params) {
            return $this->playerRepository->findPlayersOnlineByParams($params);
        }
        return $this->playerRepository->findPlayersOnline();
    }
}
