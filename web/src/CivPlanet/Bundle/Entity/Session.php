<?php

namespace CivPlanet\Bundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\ExclusionPolicy;
use JMS\Serializer\Annotation\Expose;
use JMS\Serializer\Annotation\Groups;
use JMS\Serializer\Annotation\VirtualProperty;
use JMS\Serializer\Annotation\SerializedName;

/**
 * @ORM\Entity(repositoryClass="CivPlanet\Bundle\Repository\SessionRepository")
 * @ORM\Table(name="session")
 *
 * @ExclusionPolicy("all")
 */
class Session
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     *
     * @Expose
     * @SerializedName("sessionId")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="Player", inversedBy="sessions", cascade="persist")
     * @ORM\JoinColumn(name="player_id", referencedColumnName="id")
     */
    private $player;

    /**
     * @ORM\OneToOne(targetEntity="Event")
     * @ORM\JoinColumn(name="login", referencedColumnName="id")
     **/
    private $loginEvent;

    /**
     * @ORM\OneToOne(targetEntity="Event")
     * @ORM\JoinColumn(name="logout", referencedColumnName="id")
     **/
    private $logoutEvent;

    /**
     * @ORM\Column(type="datetime")
     */
    private $timestamp;

    /**
     * @ORM\Column(type="integer")
     */
    private $duration;

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set duration
     *
     * @param integer $duration
     * @return Session
     */
    public function setDuration($duration)
    {
        $this->duration = $duration;

        return $this;
    }

    /**
     * Get duration
     *
     * @return integer
     *
     * @VirtualProperty
     * @SerializedName("duration")
     */
    public function getDuration()
    {
        return $this->duration;
    }

    /**
     * Set player
     *
     * @param \CivPlanet\Bundle\Entity\Player $player
     * @return Session
     */
    public function setPlayer(\CivPlanet\Bundle\Entity\Player $player = null)
    {
        $this->player = $player;

        return $this;
    }

    /**
     * Get player
     *
     * @return \CivPlanet\Bundle\Entity\Player
     */
    public function getPlayer()
    {
        return $this->player;
    }

    /**
     * Set loginEvent
     *
     * @param \CivPlanet\Bundle\Entity\Event $loginEvent
     * @return Session
     */
    public function setLoginEvent(\CivPlanet\Bundle\Entity\Event $loginEvent = null)
    {
        $this->loginEvent = $loginEvent;

        return $this;
    }

    /**
     * Get loginEvent
     *
     * @return \CivPlanet\Bundle\Entity\Event
     */
    public function getLoginEvent()
    {
        return $this->loginEvent;
    }

    /**
     * Set logoutEvent
     *
     * @param \CivPlanet\Bundle\Entity\Event $logoutEvent
     * @return Session
     */
    public function setLogoutEvent(\CivPlanet\Bundle\Entity\Event $logoutEvent = null)
    {
        $this->logoutEvent = $logoutEvent;

        return $this;
    }

    /**
     * Get logoutEvent
     *
     * @return \CivPlanet\Bundle\Entity\Event
     */
    public function getLogoutEvent()
    {
        return $this->logoutEvent;
    }

    /**
     * Set timestamp
     *
     * @param datetime $timestamp
     * @return Session
     */
    public function setTimestamp($timestamp)
    {
        $this->timestamp = $timestamp;

        return $this;
    }

    /**
     * Get timestamp
     *
     * @return datetime
     */
    public function getTimestamp()
    {
        return $this->timestamp;
    }

    /**
     * Get player for API
     *
     * @VirtualProperty
     * @SerializedName("player")
     */
    public function getAPIPlayer()
    {
        return array(
            "username" => $this->player->getUsername()
        );
    }

    /**
     * Get loginEvent for API
     *
     * @VirtualProperty
     * @SerializedName("login")
     */
    public function getAPILoginEvent()
    {
        return array(
            "eventId" => $this->loginEvent->getId(),
            "timestamp" => $this->loginEvent->getTimestamp(),
        );
    }

    /**
     * Get logoutEvent for API
     *
     * @VirtualProperty
     * @SerializedName("logout")
     */
    public function getAPILogoutEvent()
    {
        $logoutEvent = array(
            "eventId" => null,
            "timestamp" => null,
        );

        if ($this->logoutEvent != null) {
            $logoutEvent = array(
                "eventId" => $this->logoutEvent->getId(),
                "timestamp" => $this->logoutEvent->getTimestamp(),
            );
        }

        return $logoutEvent;
    }
}