<?php

namespace CivPlanet\Bundle\Repository;

use Doctrine\ORM\EntityRepository;

class PlayerRepository extends EntityRepository
{
    public function findAllOrderedByTimestamp()
    {
        return $this->getEntityManager()
            ->createQuery(
                'SELECT p FROM CPBundle:Player p ORDER BY p.timestamp DESC'
            )
            ->getResult();
    }

    public function findPlayersOnline()
    {
        return $this->getEntityManager()
            ->createQuery(
                'SELECT p FROM CPBundle:Player p, CPBundle:Session s
                 WHERE s.logoutEvent IS NULL and s.player = p.id
                 ORDER BY s.loginTimestamp DESC'
            )
            ->getResult();
    }

    public function findPlayersOnlineByParams($params)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();

        $query = $qb->select('p')
            ->from('CPBundle:Player', 'p')
            ->innerJoin('p.sessions', 's')
            ->orderBy('s.loginTimestamp', 'DESC');

        if (isset($params['at'])) {
            $qb->andWhere('s.loginTimestamp <= :at
                AND s.logoutTimestamp >= :at')
                ->setParameter('at', $params['at']);
        } else {
            if (isset($params['from']) && isset($params['to'])) {
                $qb->andWhere('(s.loginTimestamp >= :from AND s.logoutTimestamp <= :to)
                    OR (s.loginTimestamp <= :from AND s.logoutTimestamp >= :from)
                    OR (s.loginTimestamp <= :to AND s.logoutTimestamp >= :to)')
                    ->setParameter('from', $params['from'])
                    ->setParameter('to', $params['to']);
            } else if (isset($params['from'])) {
                $qb->andWhere('s.loginTimestamp >= :from')
                    ->setParameter('from', $params['from']);
            } else if (isset($params['to'])) {
                $qb->andWhere('s.logoutTimestamp <= :to')
                    ->setParameter('to', $params['to']);
            }
        }

        return $query->getQuery()->getResult();
    }
}