package com.example.testimport;

import android.content.ActivityNotFoundException;
import android.os.Bundle;
import android.content.Intent;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;



public class ThirdActivity  extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_third);//당신이 꾸밀 xml을 만들어 준다
        Toast.makeText(getApplicationContext(), "세번째 띄우기", Toast.LENGTH_LONG).show();


    }




}
