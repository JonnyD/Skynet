<?php

namespace CivPlanet\Bundle\Manager;

use Doctrine\ORM\EntityManager;

class SessionManager
{
    private $entityManager;
    private $sessionRepository;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->sessionRepository = $entityManager->getRepository('CPBundle:Session');
    }

    public function getSession($id)
    {
        return $this->sessionRepository->find($id);
    }

    public function getSessions($params)
    {
        if ($params) {
            return $this->sessionRepository->findSessionsByParams($params);
        }
        return $this->sessionRepository->findSessions();
    }
}