<?php

namespace CivPlanet\Bundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class HomeController extends Controller
{

    /**
     * @Route("/", name="show_home")
     */
    public function showAction()
    {
        return $this->render('CPBundle:Home:showHome.html.twig');
    }
}