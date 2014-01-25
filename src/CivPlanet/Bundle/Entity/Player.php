<?php

namespace CivPlanet\Bundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\ExclusionPolicy;
use JMS\Serializer\Annotation\Expose;
use JMS\Serializer\Annotation\Groups;
use JMS\Serializer\Annotation\SerializedName;

/**
 * @ORM\Entity(repositoryClass="CivPlanet\Bundle\Repository\PlayerRepository")
 * @ORM\Table(name="player")
 *
 * @ExclusionPolicy("all")
 */
class Player
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string")
     *
     * @Expose
     * @Groups({"list", "online"})
     */
    private $username;

    /**
     * @ORM\Column(type="datetime")
     *
     * @Expose
     * @SerializedName("joined")
     */
    private $timestamp;

    /**
     * @ORM\Column(type="datetime", name="last_login")
     *
     * @Expose
     * @Groups({"list", "online"})
     * @SerializedName("lastLogin")
     */
    private $lastLogin;

    /**
     * @ORM\Column(type="datetime", name="last_logout")
     *
     * @Expose
     * @Groups({"list", "online"})
     * @SerializedName("lastLogout")
     */
    private $lastLogout;

    /**
     * @ORM\OneToMany(targetEntity="Event", mappedBy="player", cascade="persist")
     */
    private $events;

    /**
     * @ORM\OneToMany(targetEntity="Session", mappedBy="player", cascade="persist")
     */
    private $sessions;
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->events = new \Doctrine\Common\Collections\ArrayCollection();
        $this->sessions = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
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
     * Set username
     *
     * @param string $username
     * @return Player
     */
    public function setUsername($username)
    {
        $this->username = $username;
    
        return $this;
    }

    /**
     * Get username
     *
     * @return string 
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * Set timestamp
     *
     * @param \DateTime $timestamp
     * @return Player
     */
    public function setTimestamp($timestamp)
    {
        $this->timestamp = $timestamp;

        return $this;
    }

    /**
     * Get timestamp
     *
     * @return \DateTime
     */
    public function getTimestamp()
    {
        return $this->timestamp;
    }

    /**
     * Set lastLogin
     *
     * @param \DateTime $lastLogin
     * @return Player
     */
    public function setLastLogin($lastLogin)
    {
        $this->lastLogin = $lastLogin;

        return $this;
    }

    /**
     * Get lastLogin
     *
     * @return \DateTime
     */
    public function getLastLogin()
    {
        return $this->lastLogin;
    }

    /**
     * Set lastLogout
     *
     * @param \DateTime $lastLogout
     * @return Player
     */
    public function setLastLogout($lastLogout)
    {
        $this->lastLogout = $lastLogout;

        return $this;
    }

    /**
     * Get lastLogout
     *
     * @return \DateTime
     */
    public function getLastLogout()
    {
        return $this->lastLogout;
    }

    /**
     * Add events
     *
     * @param \CivPlanet\Bundle\Entity\Event $events
     * @return Player
     */
    public function addEvent(\CivPlanet\Bundle\Entity\Event $events)
    {
        $this->events[] = $events;
    
        return $this;
    }

    /**
     * Remove events
     *
     * @param \CivPlanet\Bundle\Entity\Event $events
     */
    public function removeEvent(\CivPlanet\Bundle\Entity\Event $events)
    {
        $this->events->removeElement($events);
    }

    /**
     * Get events
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getEvents()
    {
        return $this->events;
    }

    /**
     * Add sessions
     *
     * @param \CivPlanet\Bundle\Entity\Session $sessions
     * @return Player
     */
    public function addSession(\CivPlanet\Bundle\Entity\Session $sessions)
    {
        $this->sessions[] = $sessions;
    
        return $this;
    }

    /**
     * Remove sessions
     *
     * @param \CivPlanet\Bundle\Entity\Session $sessions
     */
    public function removeSession(\CivPlanet\Bundle\Entity\Session $sessions)
    {
        $this->sessions->removeElement($sessions);
    }

    /**
     * Get sessions
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getSessions()
    {
        return $this->sessions;
    }

    public function getAvatar()
    {
        return "";
    }
}